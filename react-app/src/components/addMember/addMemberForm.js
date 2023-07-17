import React, { useState, useEffect } from "react"
import "./addMember.css"
import { createMember } from "../../store/member";
import { usersList } from "../../store/session";
import { useDispatch, useSelector } from "react-redux"

function AddMember({users, eventId, closeModal, showMenu}) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    if (!users) return <div>No Users</div>

    return users? (
        <div className="user-list-container">
            {Object.values(users.users).map((user) => {
                return (
                    <div key={user.id} className="users-container"  >
                    <div key={user.id} className="element">
                        {user.name}
                    </div>
                    <div className="element">
                        {user.id}
                    </div>
                    </div>
                )
            })}
        </div>
    ) : (
        <div>No Users</div>
    )
}

export default AddMember