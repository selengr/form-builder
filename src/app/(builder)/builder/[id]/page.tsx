import { api } from '@/services/axios/actionWapper';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import BuilderErrorPage from './error';
import { getBuilderBackConfig } from './builderBackConfig';

async function getFormDataAction(id: string) {
  return api.get(`/form/${id}`);
}

// const fake_data_one = {"name":"start-from-puroduction","questionGroups":[{"formId":7378,"position":0,"questionGroupId":7257,"questions":[]}],"typeEnum":"QUESTION","formSettingModel":{"id":null,"name":"start-from-puroduction","label":null,"timeToComplete":null,"expireDate":null,"responseLimitation":null,"startFromContinue":false,"formStatus":"CREATE","surveyTargetPlatformEnum":null,"surveyPurposeEnum":null},"formPublishSettingModel":{"publicationPublicMethod":false,"publicLink":"public-1fd398fb-27a3-4a95-b4ff-188e3460cfeb","capacityPublicLink":0,"publicationMainPageMethod":false,"privateLink":null,"showReportForResponder":false}}
// const fake_data_two = {"name":"start-from-puroduction","questionGroups":[{"formId":7378,"position":0,"questionGroupId":7257,"questions":[{"questionId":10910,"questionGroupId":7257,"formId":7378,"isLocked":null,"title":"test","questionType":"TEXT_FIELD","position":0,"label":"7378@akAIPO-ZnLc","optionList":[],"questionPropertyList":[{"id":51680,"questionId":10910,"questionPropertyEnum":"TEXT_FIELD_PATTERN","value":"SHORT_TEXT"},{"id":51681,"questionId":10910,"questionPropertyEnum":"REQUIRED","value":"false"},{"id":51682,"questionId":10910,"questionPropertyEnum":"EDIT_ANSWER_LOCKED","value":"false"},{"id":51683,"questionId":10910,"questionPropertyEnum":"DESCRIPTION","value":null},{"id":51684,"questionId":10910,"questionPropertyEnum":"MAXIMUM_LEN","value":"250"},{"id":51685,"questionId":10910,"questionPropertyEnum":"MINIMUM_LEN","value":"0"}],"spectralPlaceList":[]}]}],"typeEnum":"QUESTION","formSettingModel":{"id":null,"name":"start-from-puroduction","label":null,"timeToComplete":null,"expireDate":null,"responseLimitation":null,"startFromContinue":false,"formStatus":"CREATE","surveyTargetPlatformEnum":null,"surveyPurposeEnum":null},"formPublishSettingModel":{"publicationPublicMethod":false,"publicLink":"public-1fd398fb-27a3-4a95-b4ff-188e3460cfeb","capacityPublicLink":0,"publicationMainPageMethod":false,"privateLink":null,"showReportForResponder":false}}

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { admin?: string };
}) {
  const response = await getFormDataAction(params.id);

  if (!response.success) {
    const back = getBuilderBackConfig(searchParams?.admin);

    return (
      <BuilderErrorPage
        message={response.message}
        backHref={back.href}
        backLabel={back.label}
      />
    );
  }

  return <FormBuilderWapper data={response.data} />;
}