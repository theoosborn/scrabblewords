<template>
  <span class="letter border-black border-2 size-12 inline-grid rounded grid-cols-3 grid-rows-3"><span class="self-center col-span-3 row-start-2 text-2xl">{{ char }}</span> <span class="text-sm self-end col-start-3 row-start-3">{{points}}</span></span>
</template>

<script>
export default {
  name: "Letter",
  props: {
    char: String
  },
  data() {
    return {
      letters: {
        e: 1,
        a: 1,
        i: 1,
        o: 1,
        n: 1,
        r: 1,
        t: 1,
        l: 1,
        s: 1,
        u: 1,
        d: 2,
        g: 2,
        b: 3,
        c: 3,
        m: 3,
        p: 3,
        f: 4,
        h: 4,
        v: 4,
        w: 4,
        y: 4,
        k: 5,
        j: 8,
        x: 8,
        q: 10,
        z: 10
      }
    }
  },
  computed: {
    points() {
      return this.letters[this.char.toLowerCase()]
    }
  }
};
</script>
