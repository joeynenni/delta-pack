import { Writer, Reader } from 'bin-serde'
import { NO_DIFF, Tracker, Schema } from './types'

export function validatePrimitive(isValid: boolean, errorMessage: string): string[] {
	return isValid ? [] : [errorMessage]
}

export function validateArrayItems<T>(arr: unknown[], itemSchema: Schema<T>): string[] {
	const errors: string[] = []
	arr.forEach((item, index) => {
		const itemErrors = itemSchema.validate(item as T | undefined)
		if (itemErrors.length > 0) {
			itemErrors.forEach((err) => {
				errors.push(`Item at index ${index}: ${err.trim()}`)
			})
		}
	})
	return errors
}

export function validateObjectProperties<T extends object>(
	obj: T,
	properties: { [K in keyof T]: Schema<T[K]> }
): string[] {
	const errors: string[] = []
	for (const key in properties) {
		const propertyErrors = properties[key].validate(obj[key])
		if (propertyErrors.length > 0) {
			propertyErrors.forEach((err) => {
				if (err.includes('Property "')) {
					errors.push(`Property "${String(key)}": ${err}`)
				} else {
					errors.push(`Property "${String(key)}": ${err}`)
				}
			})
		}
	}
	return errors
}

export function encodeWithDiff<T>(
	value: T,
	encode: (buf: Writer, val: T) => void,
	tracker: Tracker,
	buf: Writer
): Writer {
	tracker.push(value !== NO_DIFF)
	if (value !== NO_DIFF) {
		encode(buf, value)
	}
	return buf
}

export function decodeWithDiff<T>(tracker: Tracker, decode: (buf: Reader) => T, buf: Reader): T | typeof NO_DIFF {
	return tracker.next() ? decode(buf) : NO_DIFF
}
