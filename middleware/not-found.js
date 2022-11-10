const notFound = (req, res) => {
  res
    .status(404)
    .send(
      "<center><h1>ooops...are you sure you typed correctly??</h1></center>"
    );
};

export default notFound;
