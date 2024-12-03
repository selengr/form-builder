function sortQuestions(questions: any, groups: any) {
  return questions?.sort((a: any, b: any) => {
    // Sort by group first
    if (
      groups?.indexOf(a?.questionGroupId) < groups?.indexOf(b?.questionGroupId)
    ) {
      return -1;
    }
    if (
      groups?.indexOf(a?.questionGroupId) > groups?.indexOf(b?.questionGroupId)
    ) {
      return 1;
    }

    // Then sort by position within the group
    if (a?.position < b?.position) {
      return -1;
    }
    if (a?.position > b?.position) {
      return 1;
    }

    // If everything else is equal, maintain original order
    return 0;
  });
}
