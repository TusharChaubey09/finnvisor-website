export async function onRequestGet(context) {

    const { request, env } = context;

    const url = new URL(request.url);

    const token = url.searchParams.get("token");

    if (!token || token !== env.ADMIN_TOKEN) {

        return new Response(
            JSON.stringify({
                error: "Unauthorized"
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }

    const { results } = await env.DB.prepare(

        `SELECT

            id,
            name,
            phone,
            email,
            service,
            message,
            status,
            created_at,
            updated_at

        FROM enquiries

        ORDER BY datetime(created_at) DESC`

    ).all();

    return new Response(

        JSON.stringify(results),

        {
            headers: {
                "Content-Type": "application/json"
            }
        }

    );

}