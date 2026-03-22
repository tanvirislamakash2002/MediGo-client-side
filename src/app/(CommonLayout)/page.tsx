import { userService } from "@/services/user.service";

export default async function Home() {
  const { data, error } = await userService.getSession()
  console.log(data, error);
  return (
    <div>
      This is home page
    </div>
  );
}
