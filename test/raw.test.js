'use strict';

import test from 'ava';
import Endb from '../src';

test('Raw Value', async t => {
	const endb = new Endb();
	t.is(await endb.set('foo', 'bar'), true);
	t.is(await endb.get('foo'), 'bar');
	const raw = await endb.get('foo', {raw: true});
	t.is(raw.value, 'bar');
});
