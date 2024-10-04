import React, { useRef, useState, useEffect, useContext } from "react";
import "./VideoCall.scss";
import {
  FaVideoSlash,
  FaVideo,
  FaMicrophoneSlash,
  FaMicrophone,
  FaPhoneAlt,
} from "react-icons/fa";
import { getURLParam } from "../../ultils/getParamURL/get_param_URL";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../../API/api_server";
import { useSocket } from "../../provider/socket_context";
import { OwnDataContext } from "../../provider/own_data";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { toast } from "react-toastify";

const VideoCall = ({ isVideoCall, titlePage, userId }) => {
  // useEffect(() => {
  //   document.title = titlePage;
  // }, [titlePage]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [receiver_id, setReceiverID] = useState();
  const [room_id, setRoomID] = useState();
  const [sender_id, setSenderID] = useState();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(isVideoCall !== false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState();

  const dataOwner = useContext(OwnDataContext);
  const socket = useSocket();
  const navigate = useNavigate();

  // Lấy tham số từ URL
  useEffect(() => {
    const params = getURLParam();
    setSenderID(params?.sender_id);
    setRoomID(params?.ROOM_ID);
    setReceiverID(params?.receiver_id);
  }, []);

  // Đăng ký và gửi thông báo đến người nghe
  useEffect(() => {
    if (socket && sender_id && receiver_id && dataOwner?.user_id) {
      socket.emit("registerUser", { user_id: dataOwner?.user_id });

      // Gửi thông báo gọi cho người nghe
      socket.emit("callUser", {
        receiver_id,
        sender_id,
        room_id,
        link_call: `/messages/video-call?ROOM_ID=${receiver_id + sender_id}&sender_id=${sender_id}&receiver_id=${receiver_id}`,
      });

      // Lắng nghe sự kiện người nghe chấp nhận
      socket.on("statusAcceptedCallUser", (data) => {
        if (data?.status === "Accepted") {
          toast("Người nghe đang vào cuộc hội thoại...");
        } else {
          toast.error("Người nghe đã từ chối gọi...");
          navigate(-1);
        }
      });
    }
  }, [socket, receiver_id, sender_id, dataOwner]);

  // Get thông tin người nghe
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await getData(
          API_GET_INFO_USER_PROFILE_BY_ID(
            dataOwner?.user_id !== sender_id ? sender_id : receiver_id
          )
        );

        if (response.status === true && response.data?.avatar) {
          const { avatar } = response.data;
          setAvatarUrl(avatar);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchAPI();
  }, [receiver_id, sender_id, dataOwner]);

  useEffect(() => {
    // Khởi tạo PeerJS client và kết nối tới PeerJS server
    if (socket && sender_id && receiver_id && dataOwner) {
      const peer = new Peer(undefined, {
        host: 'localhost',
        port: 1406,
        path: "/peerjs",
      });
      console.log("peer: ", peer);
      
      peerRef.current = peer;

      // Lắng nghe sự kiện khi nhận được peerId từ PeerJS server
      peer.on("open", (id) => {
        console.log("peer: ", id);
        socket.emit("getPeerIDCaller", {
          receiver_id: receiver_id,
          sender_id: sender_id,
          peer_id: id,
        });
      });

      socket.on("sendPeerIDCaller", (id) => {
        callPeer(id);
      });

      // Lắng nghe sự kiện khi nhận được stream từ peer khác
      peer.on("call", (call) => {
        // Trả lời cuộc gọi với stream của mình
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }

            call.answer(stream); // Trả lời cuộc gọi bằng stream video của mình

            // Nhận stream từ remote peer
            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              } else {
                console.log("remoteVideoRef.current is null, cannot set srcObject");
              }
            });
          });
      });
    }
  }, [socket, receiver_id, sender_id, dataOwner]);

  const callPeer = (id) => {
    console.log("ID người gọi: " + id);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Gọi tới peer khác
        const call = peerRef.current.call(id, stream);

        // Nhận stream từ remote peer
        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          } else {
            console.log("remoteVideoRef.current is null, cannot set srcObject");
          }
        });
      });
  };

  // Hàm kết thúc cuộc gọi
  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop()); // Dừng tất cả các track
    }
    peerRef.current.destroy(); // Hủy kết nối PeerJS
    navigate(-1); // Quay lại trang trước đó
  };

  const handleVideoToggle = () => {
    const videoTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.enabled = !isVideoMuted;
      setIsVideoMuted((prev) => !prev);
    }
  };

  const handleAudioToggle = () => {
    const audioTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack) {
      audioTrack.enabled = !isAudioMuted;
      setIsAudioMuted((prev) => !prev);
    }
  };

  return (
    <React.Fragment>
      <div className="video-call-container">
        <div className="video-wrapper">
          <video
            ref={localVideoRef}
            playsInline
            autoPlay
            muted
            className="user-video"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="partner-video"
          />
          {/* Hiện avatar nếu chưa có video từ remote */}
          {(!remoteVideoRef.current || !remoteVideoRef.current.srcObject) && avatarUrl && (
            <div className="avatar">
              <img src={avatarUrl} alt="Avatar" />
            </div>
          )}
        </div>
        <div className="controls">
          <button onClick={handleVideoToggle} className="control-button">
            {isVideoMuted ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button onClick={handleAudioToggle} className="control-button">
            {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button className="control-button end-call" onClick={handleEndCall}>
            <FaPhoneAlt />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VideoCall;
