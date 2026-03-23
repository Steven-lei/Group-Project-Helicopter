import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQueryGroupMember,
  useUpdateGroupMember,
} from "../hooks/useQueryGroup";
import axios from "axios";
const memberStyles = {
  container: {
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  backBtn: {
    padding: "8px 16px",
    cursor: "pointer",
    backgroundColor: "var(--accent-bg)",
    color: "var(--accent)",
    border: "1px solid var(--accent-border)",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  profileCard: {
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "var(--shadow)",
    position: "relative",
  },
  largeAvatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "20px",
    border: "4px solid var(--accent-bg)",
  },
  // 新增样式
  editBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    cursor: "pointer",
    backgroundColor: "var(--social-bg)",
    color: "var(--text-h)",
  },
  input: {
    display: "block",
    width: "80%",
    margin: "10px auto",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid var(--accent-border)",
    fontSize: "1.2rem",
    textAlign: "center",
    backgroundColor: "var(--bg)",
    color: "var(--text-h)",
  },
};

export function Member() {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { data: member, isLoading, isError, error } = useQueryGroupMember(id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "" });

  useEffect(() => {
    if (member) {
      setFormData({ name: member.name, role: member.role });
    }
  }, [member]);

  const updateMutation = useUpdateGroupMember();
  if (isLoading)
    return <div style={memberStyles.container}>Loading Profile...</div>;
  if (isError)
    return <div style={memberStyles.container}>Error: {error.message}</div>;
  if (!member)
    return <div style={memberStyles.container}>Member not found.</div>;
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  const handleSave = () => {
    updateMutation.mutate(
      {
        id: member.id,
        updatedData: { name: formData.name, role: formData.role },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
    setIsEditing(false);
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";
    try {
      const { data: presignedData } = await axios.post(
        `${BACKEND_BASE_URL}/api/upload`,
        {
          fileType: file.type,
          fileName: file.name,
        },
      );
      console.log(presignedData);
      const formData = new FormData();
      Object.entries(presignedData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      await axios.post(presignedData.uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateMutation.mutate({
        id: member.id,
        updatedData: { avatar_url: presignedData.publicUrl },
      });

      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, check console.");
    }
  };
  return (
    <div style={memberStyles.container}>
      <button style={memberStyles.backBtn} onClick={() => navigate(-1)}>
        ← Back to Group
      </button>

      <div style={memberStyles.profileCard}>
        <button
          style={memberStyles.editBtn}
          onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />

        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={handleAvatarClick}
        >
          <img
            src={
              member.avatar_url ||
              `https://ui-avatars.com/api/?name=${member.name}`
            }
            alt={member.name}
            style={{
              ...memberStyles.largeAvatar,
              filter: updateMutation.isPending ? "brightness(0.5)" : "none",
            }}
          />

          <div style={memberStyles.avatarOverlay}>Change Photo</div>
        </div>
        {isEditing ? (
          <div>
            <input
              style={memberStyles.input}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              autoFocus
            />
            <input
              style={memberStyles.input}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
            <button
              style={{
                ...memberStyles.backBtn,
                marginTop: "10px",
                backgroundColor: "var(--accent)",
                color: "white",
              }}
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ margin: "10px 0", fontSize: "1.8rem" }}>
              {member.name}
            </h3>
            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              {member.role}
            </p>
          </>
        )}

        <div
          style={{
            textAlign: "left",
            display: "inline-block",
            borderTop: "1px solid var(--border)",
            paddingTop: "20px",
            width: "100%",
          }}
        >
          <p>
            <strong>ID:</strong> <code>{member.id}</code>
          </p>
          <p>
            <strong>Gender:</strong> {member.gender}
          </p>
        </div>
      </div>
    </div>
  );
}
