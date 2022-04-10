export { default as AppImage } from '../..\\components\\app\\AppImage.vue'
export { default as AppLoading } from '../..\\components\\app\\AppLoading.vue'
export { default as ChipsPartyChip } from '../..\\components\\chips\\PartyChip.vue'
export { default as FormsLoginForm } from '../..\\components\\forms\\LoginForm.vue'
export { default as InputsPasswordField } from '../..\\components\\inputs\\PasswordField.vue'
export { default as UtilsPageCenter } from '../..\\components\\utils\\PageCenter.vue'
export { default as PagesBallotStepper } from '../..\\components\\pages\\ballot\\BallotStepper.vue'
export { default as PagesElectionError } from '../..\\components\\pages\\election\\ElectionError.vue'
export { default as PagesElectionHeader } from '../..\\components\\pages\\election\\ElectionHeader.vue'
export { default as PagesPreRegisterHeader } from '../..\\components\\pages\\pre-register\\PreRegisterHeader.vue'
export { default as PagesBallotCard } from '../..\\components\\pages\\ballot\\cards\\BallotCard.vue'
export { default as PagesBallotCardsCandidateCard } from '../..\\components\\pages\\ballot\\cards\\CandidateCard.vue'
export { default as PagesHomepageCardsElectionCard } from '../..\\components\\pages\\homepage\\cards\\ElectionCard.vue'
export { default as PagesBallotReceiptDialog } from '../..\\components\\pages\\ballot\\dialogs\\BallotReceiptDialog.vue'
export { default as PagesBallotDialogsCandidateDialog } from '../..\\components\\pages\\ballot\\dialogs\\CandidateDialog.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
