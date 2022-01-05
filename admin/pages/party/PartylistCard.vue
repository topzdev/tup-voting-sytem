<template>
    <v-container class="mx-auto text-center" md="4">
        <v-avatar size="100" >
            <img src="https://picsum.photos/seed/picsum/200/300"/>
        </v-avatar>
        <h1 class="headline-6 front-weight-medium">Organization Party</h1>
        
        <v-row  class="my-2" justify="center">
            <v-col cols="12" >
                <v-card>
                <v-card-text>
                <v-row no-gutters align="center">
                    <v-col cols="auto">
                    <v-avatar size="60" >
                        <img src="https://picsum.photos/seed/picsum/200/300"/>
                    </v-avatar>
                    </v-col>
                    <v-col class="px-3 d-flex flex-column justify-center text-left">
                    <h2
                        class="title text-truncate d-inline-block"
                        style="max-width: 320px"
                    >
                        Party Title
                    </h2>
                    <p class="body-2 my-0 text--secondary">
                        Party Description
                    </p>
                    </v-col>
                    <v-col cols="auto" class="ml-auto">
                    <v-btn color="primary" text >View</v-btn>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>
            </v-col>
             <v-col cols="12">
                <v-card>
                <v-card-text>
                <v-row no-gutters align="center">
                    <v-col cols="auto">
                    <v-avatar size="60" >
                        <img src="https://picsum.photos/seed/picsum/200/300"/>
                    </v-avatar>
                    </v-col>
                    <v-col class="px-3 d-flex flex-column justify-center text-left">
                    <h2
                        class="title text-truncate d-inline-block"
                        style="max-width: 320px"
                    >
                        Party Title
                    </h2>
                    <p class="body-2 my-0 text--secondary">
                        Party Description
                    </p>
                    </v-col>
                    <v-col cols="auto" class="ml-auto">
                    <v-btn color="primary" text >View</v-btn>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>
            </v-col>
        </v-row>

    </v-container>
    
</template>

<script>
export default {
    data: () => ({
      alignments: [
        'center'
      ],
    }),
  }
</script>

<style>

</style>