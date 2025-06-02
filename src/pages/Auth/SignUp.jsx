import React from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const Signup = () => {
  const [profilPic, setProfilPic] = React.useState(null);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [AdminInviteToken, setAdminInviteToken] = React.useState("");
  const [position, setPosition] = React.useState("");


  const [error, setError] = React.useState(null);

  const { updateUser } = React.useContext(UserContext); // Ambil fungsi updateUser dari context
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Masukkan Nama Lengkap");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email tidak valid");
      return;
    }
    if (!password) {
      setError("Password tidak boleh kosong");
      return;
    }
    if (!position) {
      setError("Jabatan tidak boleh kosong");
      return;
    }
    
    setError("");

    // Lanjutkan signup ke API
    try {
      // Jika ada gambar profil, upload ke server
      if (profilPic) {
        const imgUploadRes = await uploadImage(profilPic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      // melakukan signup ke API
      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        position,
        AdminInviteToken,
      });

      const { token, role } = response.data; // Ambil token dan role dari response

      if (token) {
        localStorage.setItem("token", token); // Simpan token ke localStorage
        updateUser(response.data); // Panggil fungsi untuk memperbarui user

        // mengrah ke halaman dashboard sesuai role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // Tampilkan pesan error dari server
      } else {
        setError("Terjadi kesalahan, silakan coba lagi"); // Tampilkan pesan error umum
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Buat Akun Baru</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Silakan masukkan Data Lengkap Anda
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilPic} setImage={setProfilPic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Nama Lengkap"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              placeholder="Nama Lengkap"
            />
            <Input
              type="email"
              label="Alamat Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email"
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Password"
            />
            <Input
              type="text"
              label="Jabatan (Posisi)"
              value={position}
              onChange={({ target }) => setPosition(target.value)}
              placeholder="Contoh: Staff, HRD, Arsitek, Keuangan"
            />
            <Input
              type="text"
              label="Admin Invite Token"
              value={AdminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              placeholder="6 digit kode undangan admin"
            />

            {error && (
              <p className="text-red-500 text-sm col-span-2">{error}</p>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 col-span-2"
            >
              Sign Up
            </button>

            <p className="text-xs text-slate-700 mt-4 col-span-2">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
