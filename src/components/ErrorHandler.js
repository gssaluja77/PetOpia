const ErrorHandler = (props) => {
  return (
    <div className="bg-red-100 text-red-800 flex flex-col items-center justify-start min-h-screen pt-20 py-10">
      <div className="text-center max-w-2xl mx-auto px-4">
        {props.error}
      </div>
    </div>
  );
};

export default ErrorHandler;
