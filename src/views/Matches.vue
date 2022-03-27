<template>
  <v-container>
    <v-row>
      <v-col md="6" v-for="match in matches" :key="match.id">
        <v-card class="mx-auto">
          <v-container>
            <v-row>
              <v-col md="8">
                <v-list-item-title class="headline mb-1">
                  {{ match.title }}
                </v-list-item-title>
                <p>
                  {{ match.overview }}
                </p>
              </v-col>
              <v-col md="4">
                <v-img :src="getMovieImage(match.poster_path)"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { db } from '../firebase';
// import { doc, collection, getDocs } from 'firebase/firestore';
import { doc, collection, onSnapshot } from 'firebase/firestore';

export default {
  data: () => ({
    // matches: [],
  }),
  async created() {
    // 取得 users collection 裡面的 使用者文件
    const userRef = doc(db, 'users', this.authUserId);

    // // 取得 使用者文件 裡面的 matches collection 的資料
    // const docSnap = await getDocs(collection(userRef, 'matches'));

    // // 將陣列資料依序塞入
    // docSnap.forEach((doc) => {
    //   this.matches.push(doc.data());
    // });

    onSnapshot(collection(userRef, 'matches'), (snapshot) => {
      let newMatches = [];
      snapshot.forEach((doc) => {
        newMatches.push(doc.data());
      });
      this.$store.dispatch('user/setBindMatches', newMatches);
    });
  },

  methods: {
    getMovieImage(posterPath) {
      return posterPath ? `https://image.tmdb.org/t/p/w500/${posterPath}` : '';
    },
  },
  computed: {
    authUserId() {
      return this.$store.state.user.id;
    },
    matches() {
      return this.$store.state.user.matches;
    },
  },
};
</script>

<style lang="scss" scoped></style>
