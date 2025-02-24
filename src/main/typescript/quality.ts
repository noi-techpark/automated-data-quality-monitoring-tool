// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export function throwNPE(): never {
	throw new Error('unexpected null or undefined value')
}

// use this function instead of <Class> to add runtime checking
export function cs_cast<T extends object>(tc: { new(...args: any): T }, x: any): T
{
	if (x === undefined)
		throw new Error('runtime cast: x is undefined instead of ' + tc.name);
	if (x === null)
		throw new Error('runtime cast: x is null instead of ' + tc.name);
	if (typeof x !== 'object')
		throw new Error('runtime cast: this function check only objects <T extends object>, instead of ' + (typeof x));
	if (!(x instanceof tc))
		throw new Error('runtime cast: x with type: ' + x.constructor.name + ' does not match required type: ' + tc.name);	
	return x
}

export function cs_notnull<T>(x: T|null): T
{
	if (x === null)
		throw new Error('unexpected null value');
	return x
}