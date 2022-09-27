import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { alluoPrice } from '../atoms';
import { getAlluoPrice } from 'app/common/functions/webteste';

export const useAlluoPrice = (reload = false) => {
  const [alluoPriceAtom, setAlluoPriceAtom] = useRecoilState(alluoPrice);
  useEffect(() => {
    if (reload) {
      fetchAlluoPrice();
    }
  }, [reload]);
  const fetchAlluoPrice = async () => {
    const res = await getAlluoPrice();
    setAlluoPriceAtom(res);
  };
  return { alluoPriceAtom, setAlluoPriceAtom, fetchAlluoPrice };
};
