import App from './App.svelte';

const root = document.getElementById('root')

const app = new App({
  target: root,
  props: {
    name: 'world'
  }
});

export default app;
