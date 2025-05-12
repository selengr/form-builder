export function insertMissingOperators(formula: string): string {
    let correctedFormula = formula;

    // Add missing commas between } and { or #
    correctedFormula = correctedFormula.replace(/}(?={|#)/g, '},');

    // Add missing commas in certain places inside parentheses or curly braces
    correctedFormula = correctedFormula.replace(/(\(|\{)([^()*+\-/{}]+)(?=[,})])/g, (match, p1, p2) => {
        return p1 + p2.replace(/}(?={)/g, '},');
    });

    // Add commas between adjacent ) or } and ( or {
    correctedFormula = correctedFormula.replace(/(?<=[)}])(?=[\({])/g, ',');

    // Transform avgNumber formula from $$...$$ to proper function syntax
    correctedFormula = correctedFormula.replace(/#avgNumber\$\$(.*?)\$\$/g, (match, p1) => {
        return `#avgNumber(${p1.replace(/,/g, ',')})`;
    });

    console.log("html-to-formula-with-insert-missing-operators ===>", correctedFormula);
    return correctedFormula;
}
