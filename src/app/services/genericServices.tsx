export class GenericServices {
  public static async petitionGet(url: string): Promise<any> {
    const dataSend = {
      
      method: "GET",
      headers: { "Content-Type": "application/json; charset-UTF8",
        
       },
    };

    const answer = fetch(url, dataSend)
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((myError) => {
        return myError;
      });
    return answer;
  }
}
