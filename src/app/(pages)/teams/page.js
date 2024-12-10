import { Card, Row, Col } from "antd";
import Link from "next/link";

async function fetchTeams() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${backendUrl}/api/coreTeamsData`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
}

export default async function AllTeams() {
    const teams = await fetchTeams();

    if (teams.length === 0) {
        return (
            <div className="container mx-auto py-10 mt-40 text-center text-lg font-semibold">
                No teams available
            </div>
        );
    }

    return (
        <div className="justify-center items-center mx-auto px-32">
            <div className="container mx-auto px-4 py-10 mt-24">
                <h1 className="text-3xl font-prosto text-center my-5">All Teams</h1>
                <Row
                    gutter={[16, 16]}
                    className="flex flex-wrap tablet:gap-[200px] tablet:m-[8] md:gap-8 justify-start items-start"
                >
                    {teams.map((team) => (
                        <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            xl={4}
                            key={team._id}
                            className="flex justify-start"
                        >
                            <Link href={`/teams/${team._id}`} passHref>
                                <Card
                                    hoverable
                                    className="h-[380px] w-full laptop:w-[300px] tablet:md:w-[280px] lg:w-[350px] xl:w-[400px] flex flex-col justify-between"
                                    cover={
                                        <img
                                            alt={team.name}
                                            src={team.logo_url || "/default-image.jpg"}
                                            className="h-[300px] w-full object-cover rounded-t-lg"
                                        />
                                    }
                                >
                                    <h3 className="text-lg font-prosto text-center bg-transparent">
                                        {team.name}
                                    </h3>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}
