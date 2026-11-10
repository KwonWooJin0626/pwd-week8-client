import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readLikeState, toggleRestaurantLike } from '../src/services/likes.ts';

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
let values: Map<string, string>;

beforeEach(() => {
  values = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    },
  });
});

afterEach(() => {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else Reflect.deleteProperty(globalThis, 'localStorage');
});

test('좋아요 선택과 개수를 다시 읽어 복원하고 취소할 수 있다', () => {
  assert.deepEqual(readLikeState(7, 3), { liked: false, likes: 3 });
  assert.deepEqual(toggleRestaurantLike(7, false, 3), { liked: true, likes: 4 });
  assert.deepEqual(readLikeState('7', 3), { liked: true, likes: 4 });
  assert.deepEqual(toggleRestaurantLike('7', true, 4), { liked: false, likes: 3 });
  assert.deepEqual(readLikeState(7, 3), { liked: false, likes: 3 });
});

test('숫자와 문자열 ID가 같은 식당을 중복 저장하지 않는다', () => {
  toggleRestaurantLike(7, false, 0);
  toggleRestaurantLike('7', false, 0);
  assert.deepEqual(JSON.parse(values.get('likedRestaurants')!), ['7']);
});

test('잘못된 저장 데이터는 좋아요 상태로 적용하지 않는다', () => {
  for (const invalid of ['not-json', 'null', '{}', '[null]']) {
    values.set('likedRestaurants', invalid);
    assert.throws(() => readLikeState(7, 0));
  }
  values.set('likedRestaurants', '[]');
  for (const invalid of ['null', '[]', '{"7":-1}', '{"7":"3"}']) {
    values.set('restaurantLikes', invalid);
    assert.throws(() => readLikeState(7, 0));
  }
});

test('개수 저장이 실패하면 이전 좋아요 목록을 복구한다', () => {
  values.set('likedRestaurants', '[2]');
  const storage = globalThis.localStorage;
  storage.setItem = (key: string, value: string) => {
    if (key === 'restaurantLikes') throw new Error('저장 공간 부족');
    values.set(key, value);
  };
  assert.throws(() => toggleRestaurantLike(7, false, 0), /저장 공간 부족/);
  assert.equal(values.get('likedRestaurants'), '[2]');
  assert.equal(values.has('restaurantLikes'), false);
});

test('첫 저장에서 개수 기록이 실패하면 선택 기록도 제거한다', () => {
  globalThis.localStorage.setItem = (key: string, value: string) => {
    if (key === 'restaurantLikes') throw new Error('저장 공간 부족');
    values.set(key, value);
  };
  assert.throws(() => toggleRestaurantLike(7, false, 0), /저장 공간 부족/);
  assert.equal(values.has('likedRestaurants'), false);
});
