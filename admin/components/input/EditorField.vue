<template>
  <ClientOnly>
    <!-- Use the component in the right place of the template -->
    <tiptap-vuetify
      :value="value"
      :extensions="extensions"
      :outlined="outlined"
      :hide-details="hideDetails"
      elevation="0"
      :rules="rules"
      @input="$emit('input', $event)"
    />

    <template #placeholder> Loading... </template>
  </ClientOnly>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from "tiptap-vuetify";

export default {
  props: {
    value: String,
    rules: Array,
    label: String,
    outlined: Boolean,
    hideDetails: [String, Boolean],
    placeholder: String,
    required: Boolean,
  },
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  data: () => ({
    // declare extensions you want to use
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3],
          },
        },
      ],
      Bold,
      Link,
      Code,
      HorizontalRule,
      Paragraph,
      HardBreak,
    ],
    // starting editor's content
    content: `
      <h1>Yay Headlines!</h1>
      <p>All these <strong>cool tags</strong> are working now.</p>
    `,
  }),
};
</script>
