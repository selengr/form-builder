export const handlePaeticipationType = async ({
    result,
    username,
    setLimitation,
    checkAnswerBefore,
    openDialog,
    takePart
}: any) => {

    if (result?.data?.responseLimitation) {

        if (result?.data?.startFromContinue) {
            openDialog(true);
        } else if (result?.data?.loggedInStatus === false) {
            setLimitation({
                isLimited: true,
                limitationType: result?.data?.responseLimitation,
            });
            return;
        } else {
            await checkAnswerBefore(username);
        }

    } else {
        if (result?.data?.startFromContinue) {
            openDialog(true);
        } else {
            await takePart(username);
        }
    }
};
