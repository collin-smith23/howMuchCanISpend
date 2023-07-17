import React, { useState, useEffect } from "react"
import "./addMember.css"
import { createMember } from "../../store/member";
import { usersList } from "../../store/session";
import { useDispatch, useSelector } from "react-redux"

function AddMember({ users, members, eventId, closeModal }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    const handleAddMember = (user) => {
        const member = {
            user_id: user.id,
            role: "guest"
        };
        dispatch(createMember(eventId, member))
        closeModal()
    }

    if (!users) return <div>No Users</div>

    const existingMemberIds = members.map((member) => member.user_id);

    const filteredUsers = Object.values(users.users).filter(
        (user) => !existingMemberIds.includes(user.id)
    );

    return filteredUsers.length > 0 ? (
        <div className="user-list-container">
            {filteredUsers.map((user) => {
                return (
                    <div
                        key={user.id}
                        className="users-container"
                        onClick={() => handleAddMember(user)}
                    >
                        <div className="element">
                            {user.name}
                        </div>
                        <div className="element">
                            {user.username}
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        <div>No available users to add</div>
    );
}

export default AddMember