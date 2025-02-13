export class BitTracker {
	private bits: boolean[] = []
	private readIndex: number = 0

	public get length(): number {
		return this.bits.length
	}

	push(val: boolean) {
		this.bits.push(val)
	}

	next(): boolean {
		return this.bits[this.readIndex++]
	}

	toBinary(): Uint8Array {
		const bytes = new Uint8Array(Math.ceil(this.bits.length / 8))
		for (let i = 0; i < this.bits.length; i++) {
			if (this.bits[i]) {
				bytes[Math.floor(i / 8)] |= 1 << i % 8
			}
		}
		return bytes
	}

	static fromBinary(bytes: Uint8Array, length: number): BitTracker {
		const tracker = new BitTracker()
		for (let i = 0; i < length; i++) {
			tracker.push(!!(bytes[Math.floor(i / 8)] & (1 << i % 8)))
		}
		return tracker
	}
}
