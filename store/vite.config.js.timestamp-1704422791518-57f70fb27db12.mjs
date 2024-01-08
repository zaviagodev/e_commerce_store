var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// ../../../sites/common_site_config.json
var require_common_site_config = __commonJS({
  "../../../sites/common_site_config.json"(exports, module) {
    module.exports = {
      background_workers: 1,
      db_host: "mariadb",
      default_site: "zaviago-erptest",
      file_watcher_port: 6787,
      frappe_user: "frappe",
      gunicorn_workers: 25,
      live_reload: true,
      rebase_on_pull: false,
      redis_cache: "redis://redis-cache:6379",
      redis_queue: "redis://redis-queue:6379",
      redis_socketio: "redis://redis-socketio:6379",
      restart_supervisor_on_update: false,
      restart_systemd_on_update: false,
      serve_default_site: true,
      shallow_clone: true,
      socketio_port: 9e3,
      use_redis_auth: false,
      webserver_port: 8e3
    };
  }
});

// vite.config.js
import path from "path";
import { defineConfig } from "file:///workspace/development/frappe-bench/apps/e_commerce_store/store/node_modules/vite/dist/node/index.js";
import react from "file:///workspace/development/frappe-bench/apps/e_commerce_store/store/node_modules/@vitejs/plugin-react/dist/index.mjs";

// proxyOptions.js
var common_site_config = require_common_site_config();
var { webserver_port } = common_site_config;
var proxyOptions_default = {
  "^/(app|api|assets|files)": {
    target: `http://localhost:${webserver_port}`,
    ws: true,
    router: function(req) {
      const site_name = req.headers.host.split(":")[0];
      return `http://${site_name}:${webserver_port}`;
    }
  }
};

// vite.config.js
var __vite_injected_original_dirname = "/workspace/development/frappe-bench/apps/e_commerce_store/store";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: proxyOptions_default
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    outDir: "../e_commerce_store/public/store",
    emptyOutDir: true,
    target: "es2015"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc2l0ZXMvY29tbW9uX3NpdGVfY29uZmlnLmpzb24iLCAidml0ZS5jb25maWcuanMiLCAicHJveHlPcHRpb25zLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gXCJiYWNrZ3JvdW5kX3dvcmtlcnNcIjogMSxcbiBcImRiX2hvc3RcIjogXCJtYXJpYWRiXCIsXG4gXCJkZWZhdWx0X3NpdGVcIjogXCJ6YXZpYWdvLWVycHRlc3RcIixcbiBcImZpbGVfd2F0Y2hlcl9wb3J0XCI6IDY3ODcsXG4gXCJmcmFwcGVfdXNlclwiOiBcImZyYXBwZVwiLFxuIFwiZ3VuaWNvcm5fd29ya2Vyc1wiOiAyNSxcbiBcImxpdmVfcmVsb2FkXCI6IHRydWUsXG4gXCJyZWJhc2Vfb25fcHVsbFwiOiBmYWxzZSxcbiBcInJlZGlzX2NhY2hlXCI6IFwicmVkaXM6Ly9yZWRpcy1jYWNoZTo2Mzc5XCIsXG4gXCJyZWRpc19xdWV1ZVwiOiBcInJlZGlzOi8vcmVkaXMtcXVldWU6NjM3OVwiLFxuIFwicmVkaXNfc29ja2V0aW9cIjogXCJyZWRpczovL3JlZGlzLXNvY2tldGlvOjYzNzlcIixcbiBcInJlc3RhcnRfc3VwZXJ2aXNvcl9vbl91cGRhdGVcIjogZmFsc2UsXG4gXCJyZXN0YXJ0X3N5c3RlbWRfb25fdXBkYXRlXCI6IGZhbHNlLFxuIFwic2VydmVfZGVmYXVsdF9zaXRlXCI6IHRydWUsXG4gXCJzaGFsbG93X2Nsb25lXCI6IHRydWUsXG4gXCJzb2NrZXRpb19wb3J0XCI6IDkwMDAsXG4gXCJ1c2VfcmVkaXNfYXV0aFwiOiBmYWxzZSxcbiBcIndlYnNlcnZlcl9wb3J0XCI6IDgwMDBcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93b3Jrc3BhY2UvZGV2ZWxvcG1lbnQvZnJhcHBlLWJlbmNoL2FwcHMvZV9jb21tZXJjZV9zdG9yZS9zdG9yZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZS9kZXZlbG9wbWVudC9mcmFwcGUtYmVuY2gvYXBwcy9lX2NvbW1lcmNlX3N0b3JlL3N0b3JlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2UvZGV2ZWxvcG1lbnQvZnJhcHBlLWJlbmNoL2FwcHMvZV9jb21tZXJjZV9zdG9yZS9zdG9yZS92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgcHJveHlPcHRpb25zIGZyb20gJy4vcHJveHlPcHRpb25zJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtyZWFjdCgpXSxcblx0c2VydmVyOiB7XG5cdFx0cG9ydDogODA4MCxcblx0XHRwcm94eTogcHJveHlPcHRpb25zXG5cdH0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0J0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcblx0XHR9XG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0b3V0RGlyOiAnLi4vZV9jb21tZXJjZV9zdG9yZS9wdWJsaWMvc3RvcmUnLFxuXHRcdGVtcHR5T3V0RGlyOiB0cnVlLFxuXHRcdHRhcmdldDogJ2VzMjAxNScsXG5cdH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZS9kZXZlbG9wbWVudC9mcmFwcGUtYmVuY2gvYXBwcy9lX2NvbW1lcmNlX3N0b3JlL3N0b3JlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlL2RldmVsb3BtZW50L2ZyYXBwZS1iZW5jaC9hcHBzL2VfY29tbWVyY2Vfc3RvcmUvc3RvcmUvcHJveHlPcHRpb25zLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2UvZGV2ZWxvcG1lbnQvZnJhcHBlLWJlbmNoL2FwcHMvZV9jb21tZXJjZV9zdG9yZS9zdG9yZS9wcm94eU9wdGlvbnMuanNcIjtjb25zdCBjb21tb25fc2l0ZV9jb25maWcgPSByZXF1aXJlKCcuLi8uLi8uLi9zaXRlcy9jb21tb25fc2l0ZV9jb25maWcuanNvbicpO1xuY29uc3QgeyB3ZWJzZXJ2ZXJfcG9ydCB9ID0gY29tbW9uX3NpdGVfY29uZmlnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdCdeLyhhcHB8YXBpfGFzc2V0c3xmaWxlcyknOiB7XG5cdFx0dGFyZ2V0OiBgaHR0cDovL2xvY2FsaG9zdDoke3dlYnNlcnZlcl9wb3J0fWAsXG5cdFx0d3M6IHRydWUsXG5cdFx0cm91dGVyOiBmdW5jdGlvbihyZXEpIHtcblx0XHRcdGNvbnN0IHNpdGVfbmFtZSA9IHJlcS5oZWFkZXJzLmhvc3Quc3BsaXQoJzonKVswXTtcblx0XHRcdHJldHVybiBgaHR0cDovLyR7c2l0ZV9uYW1lfToke3dlYnNlcnZlcl9wb3J0fWA7XG5cdFx0fVxuXHR9XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFDQyxvQkFBc0I7QUFBQSxNQUN0QixTQUFXO0FBQUEsTUFDWCxjQUFnQjtBQUFBLE1BQ2hCLG1CQUFxQjtBQUFBLE1BQ3JCLGFBQWU7QUFBQSxNQUNmLGtCQUFvQjtBQUFBLE1BQ3BCLGFBQWU7QUFBQSxNQUNmLGdCQUFrQjtBQUFBLE1BQ2xCLGFBQWU7QUFBQSxNQUNmLGFBQWU7QUFBQSxNQUNmLGdCQUFrQjtBQUFBLE1BQ2xCLDhCQUFnQztBQUFBLE1BQ2hDLDJCQUE2QjtBQUFBLE1BQzdCLG9CQUFzQjtBQUFBLE1BQ3RCLGVBQWlCO0FBQUEsTUFDakIsZUFBaUI7QUFBQSxNQUNqQixnQkFBa0I7QUFBQSxNQUNsQixnQkFBa0I7QUFBQSxJQUNuQjtBQUFBO0FBQUE7OztBQ25CK1csT0FBTyxVQUFVO0FBQ2hZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVzs7O0FDRitWLElBQU0scUJBQXFCO0FBQzVZLElBQU0sRUFBRSxlQUFlLElBQUk7QUFFM0IsSUFBTyx1QkFBUTtBQUFBLEVBQ2QsNEJBQTRCO0FBQUEsSUFDM0IsUUFBUSxvQkFBb0IsY0FBYztBQUFBLElBQzFDLElBQUk7QUFBQSxJQUNKLFFBQVEsU0FBUyxLQUFLO0FBQ3JCLFlBQU0sWUFBWSxJQUFJLFFBQVEsS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQy9DLGFBQU8sVUFBVSxTQUFTLElBQUksY0FBYztBQUFBLElBQzdDO0FBQUEsRUFDRDtBQUNEOzs7QURaQSxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNuQztBQUFBLEVBQ0Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLFFBQVE7QUFBQSxFQUNUO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
