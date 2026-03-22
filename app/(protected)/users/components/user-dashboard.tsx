"use client";

import { useState } from "react";
import { User, UserRole } from "@/types/user.type";
import { useHasRole } from "@/lib/auth-helper";
import UserAddDialog from "./user-add-dialog";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserEditDialog } from "./user-edit-dialog";
import UserList from "./user-list";

export function UserDashboard() {
  const canAdd = useHasRole([UserRole.ADMIN]);
  const canEdit = useHasRole([UserRole.ADMIN]);
  const canDelete = useHasRole([UserRole.ADMIN]);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUsers, setDeleteUsers] = useState<User[]>([]);
  const [addUserDialog, setAddUserDialog] = useState(false);

  return (
    <>
      <UserList
        onEdit={(user) => setEditUser(user)}
        onDelete={(user) => setDeleteUsers([user])}
        onBulkDelete={(users) => setDeleteUsers(users)}
        onAddUser={() => setAddUserDialog(true)}
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {editUser && (
        <UserEditDialog open={!!editUser} closeDialog={() => setEditUser(null)} user={editUser} />
      )}

      {addUserDialog && (
        <UserAddDialog open={addUserDialog} closeDialog={() => setAddUserDialog(false)} />
      )}

      <UserDeleteDialog
        open={deleteUsers.length > 0}
        closeDialog={() => setDeleteUsers([])}
        users={deleteUsers}
      />
    </>
  );
}
