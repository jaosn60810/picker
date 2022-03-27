<template>
  <div class="home">
    <v-card :loading="isLoading" class="mx-auto my-12" max-width="600">
      <v-progress-linear
        :value="(currentIndex / movieResultsLength) * 100"
        color="primary"
        height="25"
      ></v-progress-linear>
      <v-row>
        <v-col md="6"><v-img :src="movieImage"></v-img></v-col>
        <v-col md="6" class="mt-5">
          <v-card-title>{{ currentMovie.title }}</v-card-title>
          <v-card-text>
            <v-row align="center" class="mx-0">
              <div>{{ currentMovie.overview }}</div>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row class="d-flex justify-space-around">
              <v-btn color="green" @click="thumbsUp">
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn>
              <v-btn color="red" @click="thumbsDown">
                <v-icon>mdi-thumb-down</v-icon>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
    <v-row>
      <v-col class="text-center"
        >Powered by <a href="https://www.themoviedb.org/">The Movie Database</a>
      </v-col>
    </v-row>

    <Matches></Matches>
  </div>
</template>

<script>
import axios from 'axios';
import { db } from '../firebase';
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import Matches from './Matches.vue';

export default {
  name: 'Home',
  components: {
    Matches,
  },
  data: () => ({
    isLoading: false,
    movies: [],
    currentMovie: {},
    currentIndex: 0,
  }),
  created() {
    this.fetchMovies(this.userMovieApiPage);
  },
  methods: {
    async fetchMovies(page) {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=1d884a1e0143a76ab7c22c65b5a8f73c&language=zh-TW&sort_by=popularity.desc&include_adult=true&include_video=false&page=${page}&with_watch_monetization_types=flatrate`,
      );

      if (res.data && res.data.results.length > 0) {
        this.movies = res.data.results;
        this.currentMovie = this.movies[0];
      }
    },
    async incrementCurrentIndex() {
      if (this.currentIndex === this.movieResultsLength - 1) {
        const newPage = this.userMovieApiPage + 1;

        const authUserRef = doc(db, 'users', this.authUserId);
        await updateDoc(authUserRef, {
          movieApiPage: newPage,
        });

        this.$store.dispatch('user/setMovieApiPage', newPage);
        this.fetchMovies(newPage);
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
        this.currentMovie = this.movies[this.currentIndex];
      }
    },
    async thumbsUp() {
      // 取得 users collection 裡面的 使用者文件
      let userRef = doc(db, 'users', this.authUserId);
      // 在 使用者文件 新增 likedMovies collection
      const userLikedMoviesRef = collection(userRef, 'likedMovies');
      // 在 likedMovies collection 新增 以電影 id 為 id 的文件(避免重複)
      await setDoc(doc(userLikedMoviesRef, `${this.currentMovie.id}`), {
        ...this.currentMovie,
      });

      // 如果有配對者
      if (this.partnerID) {
        // 取得 users collection 裡面的 配對者文件
        let partnerRef = doc(db, 'users', this.partnerID);
        // 取得 配對者文件 裡面的 likedMovies collection
        const partnerLikedMoviesRef = collection(partnerRef, 'likedMovies');
        // 搜尋 partnerLikedMoviesRef 裡面有沒有相同的電影 id
        const partnerLikedSnapshot = query(
          partnerLikedMoviesRef,
          where('id', '==', this.currentMovie.id),
        );
        //  取得 搜尋結果
        const querySnapshot = await getDocs(partnerLikedSnapshot);

        if (!querySnapshot.empty) {
          // 在 使用者文件 新增 matches collection
          const userMatchesRef = collection(userRef, 'matches');
          // 在 配對者文件 新增 matches collection
          const partnerMatchesRef = collection(partnerRef, 'matches');
          // 在 matches collection 新增 以電影 id 為 id 的文件(避免重複)
          await setDoc(doc(userMatchesRef, `${this.currentMovie.id}`), {
            ...this.currentMovie,
          });
          // 在 matches collection 新增 以電影 id 為 id 的文件(避免重複)
          await setDoc(doc(partnerMatchesRef, `${this.currentMovie.id}`), {
            ...this.currentMovie,
          });
        }
      }

      this.incrementCurrentIndex();
    },
    async thumbsDown() {
      await this.incrementCurrentIndex();
    },
  },
  computed: {
    movieResultsLength() {
      return this.movies.length;
    },
    userMovieApiPage() {
      return this.$store.state.user.movieApiPage;
    },
    authUserId() {
      return this.$store.state.user.id;
    },
    partnerID() {
      return this.$store.state.user.partnerID;
    },
    movieImage() {
      return this.currentMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500/${this.currentMovie.poster_path}`
        : '';
    },
  },
};
</script>
