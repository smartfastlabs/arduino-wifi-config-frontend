const registration = self.registration;

self.addEventListener("push", (event) => {
  console.log("got push", event);
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }

  console.log("processing push push event", event);
  const data = event.data?.json() ?? {};
  registration
    .showNotification(data.title || "title", {
      body: data.body || "body",
      tag: data.tag,
    })
    .then((k) => console.log("success", k)),
    (err) => console.log("error", err);
});
