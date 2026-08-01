export async function onRequestPost(context) {

    const { request, env } = context;

    try {

        const { token, id, status } = await request.json();

        // Verify Admin Token
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

        // Allow only valid statuses
        const allowedStatus = [

            "Pending",
            "Contacted",
            "Closed"

        ];

        if (!allowedStatus.includes(status)) {

            return new Response(
                JSON.stringify({
                    error: "Invalid Status"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }

        // Update Status
        await env.DB.prepare(

            `UPDATE enquiries

             SET

             status = ?,

             updated_at = datetime('now', '+5 hours', '+30 minutes')

             WHERE id = ?`

        )

        .bind(

            status,

            id

        )

        .run();

        return new Response(

            JSON.stringify({

                success: true

            }),

            {

                headers: {

                    "Content-Type": "application/json"

                }

            }

        );

    }

    catch (err) {

        return new Response(

            JSON.stringify({

                error: err.message

            }),

            {

                status: 500,

                headers: {

                    "Content-Type": "application/json"

                }

            }

        );

    }

}