
export function insertMissingOperators(formula: string): string {

    let correctedFormula = formula.replace(/}(?={|#)/g, '}*');
  
    correctedFormula = correctedFormula.replace(/(\(|\{)([^()*+\-/{}]+)(?=[,})])/g, (match, p1, p2) => {
      return p1 + p2.replace(/}(?={)/g, '}*');
    });
    correctedFormula = correctedFormula.replace(/(?<=[)}])(?=[\({])/g, '*');
    correctedFormula = correctedFormula.replace(/#avgNumber$$(.*?)$$/g, (match, p1) => {
      return '#avgNumber(' + p1.replace(/,/g, '*') + ')';
    });
  // new v of code for adding * between missing op
    console.log("html-to-formula-with-insert-missing-operators ===>", correctedFormula);
    return correctedFormula;
  }
  
  