export { default as CardsCandidateCard } from '../..\\components\\cards\\CandidateCard.vue'
export { default as CardsElectionCard } from '../..\\components\\cards\\ElectionCard.vue'
export { default as CardsPartyCard } from '../..\\components\\cards\\PartyCard.vue'
export { default as AppAvatar } from '../..\\components\\app\\AppAvatar.vue'
export { default as AppImage } from '../..\\components\\app\\AppImage.vue'
export { default as AppLoading } from '../..\\components\\app\\AppLoading.vue'
export { default as ChipsElectionChip } from '../..\\components\\chips\\ElectionChip.vue'
export { default as ChipsElectionStatusChip } from '../..\\components\\chips\\ElectionStatusChip.vue'
export { default as ChipsPartyChip } from '../..\\components\\chips\\PartyChip.vue'
export { default as FormsLoginForm } from '../..\\components\\forms\\LoginForm.vue'
export { default as InputsPasswordField } from '../..\\components\\inputs\\PasswordField.vue'
export { default as UtilsPageCenter } from '../..\\components\\utils\\PageCenter.vue'
export { default as PagesBallotStepper } from '../..\\components\\pages\\ballot\\BallotStepper.vue'
export { default as PagesCandidatePageHeader } from '../..\\components\\pages\\candidate\\CandidatePageHeader.vue'
export { default as PagesElectionFinalTally } from '../..\\components\\pages\\election\\ElectionFinalTally.vue'
export { default as PagesElectionPageHeader } from '../..\\components\\pages\\election\\ElectionPageHeader.vue'
export { default as PagesElectionParty } from '../..\\components\\pages\\election\\ElectionParty.vue'
export { default as PagesElectionPositionCandidates } from '../..\\components\\pages\\election\\ElectionPositionCandidates.vue'
export { default as PagesHomepageCarousel } from '../..\\components\\pages\\homepage\\HomepageCarousel.vue'
export { default as PagesPartyPageHeader } from '../..\\components\\pages\\party\\PartyPageHeader.vue'
export { default as PagesPartyPositionCandidates } from '../..\\components\\pages\\party\\PartyPositionCandidates.vue'
export { default as PagesPreRegisterHeader } from '../..\\components\\pages\\pre-register\\PreRegisterHeader.vue'
export { default as PagesVotingElectionError } from '../..\\components\\pages\\voting\\ElectionError.vue'
export { default as PagesVotingElectionHeader } from '../..\\components\\pages\\voting\\ElectionHeader.vue'
export { default as PagesBallotCard } from '../..\\components\\pages\\ballot\\cards\\BallotCard.vue'
export { default as PagesBallotCardsCandidateCard } from '../..\\components\\pages\\ballot\\cards\\CandidateCard.vue'
export { default as PagesBallotReceiptDialog } from '../..\\components\\pages\\ballot\\dialogs\\BallotReceiptDialog.vue'
export { default as PagesBallotDialogsCandidateDialog } from '../..\\components\\pages\\ballot\\dialogs\\CandidateDialog.vue'
export { default as PagesElectionListsTallyCandidateListItem } from '../..\\components\\pages\\election\\lists\\TallyCandidateListItem.vue'

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
