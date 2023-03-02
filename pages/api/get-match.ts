const handler = (req, res) => {
    const data = {
      message: "Hello, World!"
    };
    res.status(200).json(data);
  };

export default(handler)