export const getAllModules = (req, res) => {
    res.send({ body: { title: "Get all modules" } });
  };
  
  export const getModuleById = (req, res) => {
    res.send({ body: { title: "Get single module" } });
  };
  
  export const createModule = (req, res) => {
    res.send({ body: { title: "Create new module" } });
  };
  
  export const updateModule = (req, res) => {
    res.send({ body: { title: "Update specific module" } });
  };
  
  export const deleteModule = (req, res) => {
    res.send({ body: { title: "Delete specific module" } });
  };