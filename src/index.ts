

import app from "./api/server";
import { config } from "./config";






const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

