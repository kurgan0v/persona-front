import {useEffect, useState} from 'react';

// useDebounce - кастомный хук, который откладывает set value на delay.

// Принимает:
// value - состояние, set которого нужно отложить
// delay - время задержки

// Возвращает:
// debouncedValue - начальное состояние
// isDebounce - флаг, который показывает идет ли сейчас Debounce

function useCustomDebounce<T>(value: T, delay: number): [T, boolean] {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isDebounce, setIsDebounce] = useState(false);

    useEffect(() => {
        setIsDebounce(true);
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
            setIsDebounce(false);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return [debouncedValue, isDebounce];
}

export default useCustomDebounce;
