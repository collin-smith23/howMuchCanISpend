import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as memberActions from "../../store/member";
import { useParams } from 'react-router-dom';
import './members.css'
import OpenModalButton from '../OpenModalButton';

function DisplayMembers({ members, eventId, closeModal }) {
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    console.log(eventId)

    const handleRoleChange = (e, member) => {
        const newRole = e.target.value;
        const formMember = {
            id: member.id,
            role: newRole
        };
        dispatch(memberActions.editMember(eventId, formMember));
        closeModal()
    };

    const isAdmin = () => {
        const userRole = members.find((member) => member.user_id === user.id)?.role;
        return userRole === 'admin' || userRole === 'owner';
    };

    return (
        <div className="members-container">
            {members.map((member) => (
                <div className="members-box" key={member.id}>
                    <div className="element">{member.username}</div>
                    <div className="element">
                        {isAdmin() ? (
                            <select
                                value={member.role}
                                onChange={(e) => handleRoleChange(e, member)}
                            >
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                                <option value="guest">Guest</option>
                            </select>
                        ) : (
                            member.role
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DisplayMembers;