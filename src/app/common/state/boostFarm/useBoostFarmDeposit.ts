import { depositIntoBoostFarm } from 'app/common/functions/boostFarm';
import { heapTrack } from 'app/common/functions/heapClient';
import { isNumeric } from 'app/common/functions/utils';
import {
  approve,

  getAllowance,
  getBalanceOf
} from 'app/common/functions/web3Client';
import { useNotification } from 'app/common/state';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBoostFarmDeposit = ({
  selectedFarm,
  selectedSupportedToken,
  updateFarmInfo,
}) => {
  // react
  const navigate = useNavigate();

  // other state control files
  const { setNotification } = useNotification();

  // inputs
  const [depositValue, setDepositValue] = useState<string>();
  const [depositValueError, setDepositValueError] = useState<string>('');

  // data
  const [selectedSupportedTokenInfo, setSelectedSupportedTokenInfo] =
    useState<any>({
      balance: 0,
      allowance: 0,
    });

  // biconomy
  const [useBiconomy, setUseBiconomy] = useState(false);

  // loading control
  const [isFetchingSupportedTokenInfo, setIsFetchingSupportedTokenInfo] =
    useState(true);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  const resetState = () => {
    setDepositValueError('');
    setIsApproving(false);
    setIsDepositing(false);
  };

  useEffect(() => {
    const updateBalanceAndAllowance = async () => {
      setIsFetchingSupportedTokenInfo(true);

      const allowance = await getAllowance(
        selectedSupportedToken.address,
        selectedFarm.farmAddress,
        selectedFarm.chain,
      );
      const balance = await getBalanceOf(
        selectedSupportedToken.address,
        selectedSupportedToken.decimals,
        selectedFarm.chain,
      );
      setSelectedSupportedTokenInfo({ balance: balance, allowance: allowance });

      setIsFetchingSupportedTokenInfo(false);
    };

    if (selectedFarm && selectedSupportedToken) {
      updateBalanceAndAllowance();
    }
  }, [selectedSupportedToken]);

  const handleApprove = async () => {
    setIsApproving(true);

    try {
      const tx = await approve(
        selectedFarm.farmAddress,
        selectedSupportedToken.address,
        selectedFarm.chain,
      );
      await updateFarmInfo();
      heapTrack('approvedTransactionMined', {
        pool: 'boost',
        currency: selectedSupportedToken.label,
        amount: depositValue,
      });
      setNotification(
        'Approved successfully',
        'success',
        tx.transactionHash,
        selectedFarm.chain,
      );
    } catch (err) {
      setNotification(err, 'error');
    }

    setIsApproving(false);
  };

  const handleDepositValueChange = value => {
    resetState();
    if (!(isNumeric(value) || value === '' || value === '.')) {
      setDepositValueError('Write a valid number');
    } else if (+value > +selectedSupportedToken?.balance) {
      setDepositValueError('Insufficient balance');
    }
    setDepositValue(value);
  };

  const handleDeposit = async () => {
    setIsDepositing(true);

    try {
      heapTrack('startedDepositing', {
        pool: 'boost',
        currency: selectedSupportedToken.label,
        amount: depositValue,
      });
      const tx = await depositIntoBoostFarm(
        selectedFarm.farmAddress,
        selectedSupportedToken.address,
        depositValue,
        selectedSupportedToken.decimals,
        selectedFarm.chain,
        useBiconomy,
      );
      resetState();
      setDepositValue(null);
      heapTrack('depositTransactionMined', {
        pool: 'boost',
        currency: selectedSupportedToken.label,
        amount: depositValue,
      });
      setNotification(
        'Deposit successful',
        'success',
        tx.transactionHash,
        selectedFarm.chain,
      );
      navigate('/?view_type=my_farms');
      //await updateFarmInfo();
    } catch (error) {
      resetState();
      setNotification(error, 'error');
    }

    setIsDepositing(false);
  };

  return {
    depositValue,
    handleDepositValueChange,
    isApproving,
    handleApprove,
    isDepositing,
    handleDeposit,
    setUseBiconomy,
    useBiconomy,
    resetState,
    depositValueError,
    hasErrors: depositValueError != '',
    isFetchingSupportedTokenInfo,
    selectedSupportedTokenInfo,
  };
};
