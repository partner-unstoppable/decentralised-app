import { useAutoInvestTab } from 'app/common/state/autoInvest';
import {
  DateInput,
  FeeInfo,
  Info,
  ProjectedWeeklyInfo,
  Spinner,
  StreamInput,
  SubmitButton
} from 'app/modernUI/components';
import { RightAlignToggle } from 'app/modernUI/components/Toggles';
import { Box, Text } from 'grommet';

export const AutoInvestTab = ({ ...rest }) => {
  const {
    //loading
    isLoading,
    isStartingStream,
    isApproving,
    isDepositing,
    isFetchingFarmInfo,
    isUpdatingSelectedStreamOption,
    // errors
    hasErrors,
    // inputs
    disableInputs,
    streamValue,
    validateInputs,
    selectedSupportedFromToken,
    streamValueError,
    selectSupportedFromToken,
    supportedFromTokens,
    supportedToTokens,
    selectedSupportedToToken,
    selectSupportedToToken,
    targetFarmInfo,
    useBiconomy,
    setUseBiconomy,
    useEndDate,
    setUseEndDate,
    endDate,
    setEndDate,
    endDateError,
    currentStep,
    selectedStreamOptionSteps,
    handleCurrentStep,
  } = useAutoInvestTab();

  return (
    <Box fill>
      <Box style={{ minHeight: '410px' }} justify="center">
        {isStartingStream || isApproving || isDepositing ? (
          <Box
            align="center"
            justify="center"
            fill="vertical"
            margin={{ top: 'large', bottom: 'medium' }}
          >
            <Spinner pad="large" />
          </Box>
        ) : (
          <Box margin={{ top: '46px' }}>
            <Box>
              <StreamInput
                label="Flow rate"
                tokenSign={selectedSupportedFromToken?.sign}
                onValueChange={validateInputs}
                value={streamValue}
                maxValue={selectedSupportedFromToken?.balance}
                fromTokenOptions={supportedFromTokens}
                selectedFromToken={selectedSupportedFromToken}
                setSelectedFromToken={selectSupportedFromToken}
                toTokenOptions={supportedToTokens}
                selectedToToken={selectedSupportedToToken}
                setSelectedToToken={selectSupportedToToken}
                error={streamValueError}
                disabled={disableInputs || isLoading || isFetchingFarmInfo || isUpdatingSelectedStreamOption}
              />
              <RightAlignToggle
                isToggled={useEndDate}
                setIsToggled={setUseEndDate}
                label="Set end date for stream"
                disabled={disableInputs || isLoading || isFetchingFarmInfo || isUpdatingSelectedStreamOption}
              />
              {useEndDate && (
                <>
                  <DateInput
                    label="End date"
                    date={endDate}
                    setDate={setEndDate}
                    disabled={disableInputs}
                  />
                  {endDateError && (
                    <Text color="error" size="small" margin={{ top: 'small' }}>
                      {endDateError}
                    </Text>
                  )}
                </>
              )}
            </Box>
            <Box
              margin={{ top: 'medium' }}
              style={{ minHeight: '224px' }}
              justify="center"
            >
              <ProjectedWeeklyInfo
                depositedAmount={targetFarmInfo?.depositedAmount}
                inputValue={streamValueError}
                interest={targetFarmInfo?.interest}
                sign={targetFarmInfo?.sign}
                isLoading={isLoading || isFetchingFarmInfo || isUpdatingSelectedStreamOption}
              />
              <Info
                label="APY"
                value={targetFarmInfo?.interest + '%'}
                isLoading={isLoading || isFetchingFarmInfo || isUpdatingSelectedStreamOption}
              />
              <Info
                label="Pool liquidity"
                value={
                  targetFarmInfo?.sign +
                  (+targetFarmInfo?.totalAssetSupply).toLocaleString()
                }
                isLoading={isLoading || isFetchingFarmInfo || isUpdatingSelectedStreamOption}
              />
              <FeeInfo
                useBiconomy={useBiconomy}
                setUseBiconomy={setUseBiconomy}
                disableBiconomy={true}
                showWalletFee={!useBiconomy}
                isLoading={isLoading || isFetchingFarmInfo || isUpdatingSelectedStreamOption}
              />
            </Box>
          </Box>
        )}
      </Box>
      <Box margin={{ top: 'large' }}>
        <SubmitButton
          primary
          disabled={
            isLoading ||
            hasErrors ||
            isUpdatingSelectedStreamOption ||
            isApproving || isDepositing ||
            !(+streamValue > 0)
          }
          label={
            isLoading || isUpdatingSelectedStreamOption
              ? 'Loading...'
              : `Step ${currentStep + 1} of ${
                  selectedStreamOptionSteps?.length
                }: ${selectedStreamOptionSteps[currentStep]?.label}`
          }
          onClick={handleCurrentStep}
          glowing={currentStep > 0}
        />
      </Box>
    </Box>
  );
};
