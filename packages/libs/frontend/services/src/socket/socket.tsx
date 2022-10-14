// const URL = "http://localhost:3333/"; //process.env['REACT_APP_URL_TO_BACK'] ;

// class SocketService {
//   async requestUserMatchInfo(): Promise<MatchDto[]> {
//     const user_info: any = AuthReq.getCurrentUser();
//     try {
//       const ret = await axios.get(URL + "match/" + user_info.name, {
//         headers: authHeader(),
//       });
//       return ret.data.matches;
//     } catch (err) {
//       throw Error(err);
//     }
//   }
// }

// const Socket = new SocketService();

// export { Socket };
