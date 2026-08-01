export async function onRequestPost(context){

    const {request,env}=context;

    try{

        const {token,id}=await request.json();

        if(!token || token!==env.ADMIN_TOKEN){

            return new Response(

                JSON.stringify({

                    error:"Unauthorized"

                }),

                {

                    status:401,

                    headers:{

                        "Content-Type":"application/json"

                    }

                }

            );

        }

        await env.DB.prepare(

            `DELETE FROM enquiries

            WHERE id=?`

        )

        .bind(id)

        .run();

        return new Response(

            JSON.stringify({

                success:true

            }),

            {

                headers:{

                    "Content-Type":"application/json"

                }

            }

        );

    }

    catch(err){

        return new Response(

            JSON.stringify({

                error:err.message

            }),

            {

                status:500,

                headers:{

                    "Content-Type":"application/json"

                }

            }

        );

    }

}
