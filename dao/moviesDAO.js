let movies;
export default class MoviesDAO {
  static async injectDB(conn) {
    if (movies) {
      console.log('movies already connected');
      return;
    }
    try {
      movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies');
      console.log('movies connected');
    } catch (e) {
      console.error(`unable to connect in MoviesDAO: ${e}`);
    }
  }

  static async getMovies({
    filters = null, // default filter
    page = 0,
    moviesPerPage = 20, // will only get 20 movies at once
  } = {}) {
    let query;
    if (filters) {
      if ('title' in filters) {
        query = { $text: { $search: filters['title'] } };
      } else if ('rated' in filters) {
        query = { rated: { $eq: filters['rated'] } };
      }
    }

    let cursor;
    try {
      cursor = await movies
        .find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);
      const moviesList = await cursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);
      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }
  }
}
