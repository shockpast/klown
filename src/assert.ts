export default class Assert {
	/**
	 * Checks if `type` is equals `expected_type`
	 *
	 * @param type Actual type that is.
	 * @param expected_type Type that was expected to be.
	 * @returns
	 */
	public isType(type: any, expected_type: any): boolean {
		return typeof(type) == expected_type
	}

	/**
	 * Checks if `instance` is instanceof
	 * `expected_instance`
	 *
	 * @param instance Actual instance that is.
	 * @param expected_instance Instance that was expected to be.
	 * @returns
	 */
	public isInstanceOf(instance: any, expected_instance: any): boolean {
		return instance instanceof expected_instance
	}

	/**
	 * Checks if `arg1` equals to `expected_arg2`
	 *
	 * @param arg1 Actual value that is.
	 * @param expected_arg2 Value that was expected to be.
	 * @returns
	 */
	public is(arg1: any, expected_arg2: any): boolean {
		return arg1 == expected_arg2
	}

	/**
	 * Checks if `arg` equals true.
	 *
	 * @param arg Argument that must be true.
	 * @returns
	 */
	public truthy(arg: any): boolean {
		return arg == true
	}

	/**
	 * Checks if `arg` equals false.
	 *
	 * @param arg Argument that must be false.
	 * @returns
	 */
	public falsy(arg: any): boolean {
		return arg == false
	}
}