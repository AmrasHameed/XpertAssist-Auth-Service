import jwt, { Secret } from 'jsonwebtoken'
import "dotenv/config"

export class Authcontroller {

    refreshToken = async(call:any, callback:any) => {
        try{
            const refreshtoken = call.request.token as string;
            const decoded: any = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN ||"Amras" as Secret);
            if(!decoded){
                throw new Error("refresh invalid token  ")
            }
            console.log("token refreshed ");
            const refreshToken = jwt.sign({id: decoded.id, role: decoded.role}, process.env.REFRESH_TOKEN ||"Amras" as Secret, {
                expiresIn: "7d"
            })
            const accessToken = jwt.sign({id: decoded.id, role: decoded.role}, process.env.ACCESS_TOKEN ||"Amras"as Secret, {
                expiresIn: "15m"
            })
            const response = {accessToken, refreshToken}
            callback(null, response)
        }catch(e:any){
            console.log(e);  
            callback(e, {message:"something gone wrong in authentication "})
        }
    }
}