import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InstagramLeadsClient from "./InstagramLeadsClient";

export default async function InstagramLeadsPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        redirect("/login");
    }

    return <InstagramLeadsClient />;
}
