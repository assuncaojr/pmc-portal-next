import { Field, ConditionalLogic } from '../types';

/**
 * Dynamically evaluates conditional logic for a field based on the current state of other form inputs.
 * Supports groups of rules evaluated as AND/OR groups, and custom matching conditions.
 * Decoupled from WordPress environment, fully safe to run in SSR (Next.js) contexts.
 *
 * @param field The target form field to evaluate
 * @param formValues Dictionary containing current values of all form fields (keyed by field ID)
 * @returns boolean True if the field should be visible/active, false if hidden/disabled
 */
export function evaluateConditionalLogic(
  field: Field,
  formValues: Record<string, any>
): boolean {
  const logic: ConditionalLogic | undefined = field.conditional_logic;

  if (!logic || !logic.enabled || !logic.groups || logic.groups.length === 0) {
    return true; // Visible by default if logic is missing or disabled
  }

  const action = logic.action || 'show'; // 'show' or 'hide'
  const matchType = logic.match || 'all'; // 'all' (AND rules inside group) or 'any' (OR rules inside group)

  // Evaluate each rule group (Groups are combined via OR logic)
  const groupResults = logic.groups.map(group => {
    if (!group.rules || group.rules.length === 0) return true;

    const ruleResults = group.rules.map(rule => {
      const targetVal = formValues[rule.fieldId];
      const ruleVal = rule.value;

      // Normalization of values for easier comparison
      const targetValStr = targetVal !== null && targetVal !== undefined ? String(targetVal).trim() : '';
      const ruleValStr = ruleVal !== null && ruleVal !== undefined ? String(ruleVal).trim() : '';

      switch (rule.operator) {
        case '==':
          return targetValStr === ruleValStr;

        case '!=':
          return targetValStr !== ruleValStr;

        case 'contains':
          return targetValStr.toLowerCase().includes(ruleValStr.toLowerCase());

        case 'empty':
          return (
            !targetVal ||
            targetValStr === '' ||
            (Array.isArray(targetVal) && targetVal.length === 0)
          );

        case 'not_empty':
          return (
            targetVal !== null &&
            targetVal !== undefined &&
            targetValStr !== '' &&
            (!Array.isArray(targetVal) || targetVal.length > 0)
          );

        case '>':
          return Number(targetVal) > Number(ruleVal);

        case '<':
          return Number(targetVal) < Number(ruleVal);

        case '>=':
          return Number(targetVal) >= Number(ruleVal);

        case '<=':
          return Number(targetVal) <= Number(ruleVal);

        default:
          return true;
      }
    });

    // Combine rules inside this single group
    return matchType === 'all'
      ? ruleResults.every(r => r === true)
      : ruleResults.some(r => r === true);
  });

  // Combine groups via OR logic
  const satisfiesLogic = groupResults.some(g => g === true);

  return action === 'show' ? satisfiesLogic : !satisfiesLogic;
}
export default evaluateConditionalLogic;
