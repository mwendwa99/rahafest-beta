import { createAsyncThunk } from "@reduxjs/toolkit";
import { rahaApi, rahaImageApi } from "../../services/api.service";

const placeholderImage = "../../assets/placeholder.png";

export const fetchNews = createAsyncThunk(
  "event/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await rahaApi.get("media");

      //filter response to only render active news
      response.data.data = response.data.data.filter(
        (article) => article.active === true
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const fetchGallery = createAsyncThunk(
//   "event/fetchGallery",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await rahaApi.get("gallery");

//       //filter response to only render active gallery
//       const filteredGallery = response.data.data.filter(
//         (item) => item.active === true
//       );

//       return filteredGallery;
//     } catch (error) {
//       console.error(error);
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchGallery = createAsyncThunk(
  "event/fetchGallery",
  async (_, { rejectWithValue }) => {
    try {
      const response = await rahaApi.get("gallery");

      // Filter response to only render active gallery
      const filteredGallery = response.data.data.filter(
        (item) => item.active === true
      );

      // Format the gallery data
      const formattedGallery = filteredGallery.reduce((acc, item) => {
        if (item.title) {
          if (!acc[item.title]) {
            acc[item.title] = [];
          }
          acc[item.title].push({
            uri: item.image ? item.image : placeholderImage,
            id: item.id.toString(),
          });
        }
        return acc;
      }, {});

      return formattedGallery;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);
