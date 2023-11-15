import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";

import { BoardNavbar } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/board-navbar";



  const BoardIdLayout = async ({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { boardId: string };
  }) => {
    const { orgId } = auth();
  
    if (!orgId) {
      redirect("/select-org");
    }
  
    // Fetching the specific board
    const board = await db.board.findUnique({
      where: {
        id: params.boardId,
        orgId,
      },
    });
  
    // Fetching all boards for the organization
    const allBoards = await db.board.findMany({
      where: {
        orgId,
      },
    });
  
    if (!board) {
      notFound();
    }
  
    return (
      <div
        className="relative h-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      >
        <BoardNavbar data={board} />
        <div className="absolute inset-0 bg-black/10" />
        <main className="relative pt-28 h-full">
          {/* Render the specific board */}
          <h1>{board.title}</h1>
  
          {/* Render all boards */}
          <ul>
            {allBoards.map((board) => (
              <li key={board.id}>{board.title}</li>
            ))}
          </ul>
  
          {children}
        </main>
      </div>
    );
  };
  
  export default BoardIdLayout;
  