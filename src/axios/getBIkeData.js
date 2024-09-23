import axios from "axios";

const getBikeData = async () => {
    try {
          const res = await axios.get('/api/api/getBikeData');
          console.log(res.data);
          return res.data;
    }
    catch (err) {
         console.error(err); 
    }
};

export default getBikeData;
  