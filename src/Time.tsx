import { useDebugValue, useEffect, useState } from 'react';

function useCurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // 将 useDebugValue 移到这里
  useDebugValue(time, time => time.toLocaleTimeString());

  return time;
}

export function Time() {
  const time = useCurrentTime();
  return (
    <div>
      <span>{time.toLocaleTimeString()}</span>
    </div>
  );
}
