export default function StatusBar({ currentModel, serverStatus }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4 text-center">
        <div
          className={`text-2xl font-bold ${
            serverStatus ? "text-green-400" : "text-red-400"
          }`}
        >
          {serverStatus ? "Online" : "Offline"}
        </div>
        <div className="text-xs text-gray-400 uppercase mt-1">Status</div>
      </div>
      <div className="bg-gray-900/50 border border-purple-400/30 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-purple-400">
          /{currentModel.path}
        </div>
        <div className="text-xs text-gray-400 uppercase mt-1">Route</div>
      </div>
      <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-400">
          {currentModel.type === "image"
            ? "ViT"
            : currentModel.id === 2
            ? "Deep Learning"
            : "Transformer"}
        </div>
        <div className="text-xs text-gray-400 uppercase mt-1">Architecture</div>
      </div>
    </div>
  );
}
