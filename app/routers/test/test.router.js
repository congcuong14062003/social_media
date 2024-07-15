export default function TestRouter(router) {
  router.get("/", (req, res) => {
    res.send("Welcome");
  });
  return router;
}
