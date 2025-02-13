/** Represents a value that indicates no changes in delta encoding */
export const NO_DIFF = Symbol('NO_DIFF')

export const HEADERS = {
	FULL_VALUE: 0x00,
	NO_CHANGE_VALUE: 0x01,
	DELETION_VALUE: 0x02,
	FULL_ARRAY: 0x03,
	NO_CHANGE_ARRAY: 0x04,
	DELETION_ARRAY: 0x05,
	DELTA_ARRAY: 0x06,
	EMPTY_ARRAY: 0x07,
	FULL_OBJECT: 0x08,
	NO_CHANGE_OBJECT: 0x09,
	DELETION_OBJECT: 0x0a,
	DELTA_OBJECT: 0x0b,
	EMPTY_OBJECT: 0x0c
}
